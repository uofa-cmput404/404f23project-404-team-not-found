from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from socialdistribution.auth.node_authentication import (
    NodeAuthentication,
    NodeIsAuthenticated,
)
from .constants import LOCAL_REFERERS


def get_custom_authenticators(request):
    referer = request.META.get("HTTP_REFERER")

    if referer and any(referer.startswith(base_url) for base_url in LOCAL_REFERERS):
        return [BasicAuthentication()]  # For local node referers
    else:
        print("should be node")
        return [NodeAuthentication()]  # For remote addresses using Node model


def get_custom_permissions(request):
    referer = request.META.get("HTTP_REFERER")

    # This code will requires basic auth on the local node referers addresses.
    # For remote addresses, do the auth based on Node model?
    if referer and any(referer.startswith(base_url) for base_url in LOCAL_REFERERS):
        return [IsAuthenticated()]  # For local node referers
    else:
        print("should be node")
        return [NodeIsAuthenticated()]  # For remote addresses using Node model
